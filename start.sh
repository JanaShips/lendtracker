#!/bin/bash
echo "=== Finding JAR file ==="
JAR_FILE=$(find target -name "*.jar" ! -name "*-sources.jar" ! -name "*-javadoc.jar" | grep -v original | head -1)
echo "Found JAR: $JAR_FILE"
echo "=== Starting Application ==="
exec java -Dserver.port=$PORT -Dspring.profiles.active=mysql -jar "$JAR_FILE"
